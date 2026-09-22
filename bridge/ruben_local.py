from __future__ import annotations

import json
import os
import secrets
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

try:
    import psycopg
except Exception:
    psycopg = None

HOST = "127.0.0.1"
PORT = 8788
ALLOWED_ORIGINS = {
    "https://duiliomf.github.io",
    "http://127.0.0.1:8788",
    "http://localhost:8788",
}
SESSIONS: dict[str, psycopg.Connection] = {}
LOCK = threading.Lock()


def json_bytes(data):
    return json.dumps(data, ensure_ascii=False).encode("utf-8")


class Handler(BaseHTTPRequestHandler):
    server_version = "RubenLocal/1.0"

    def log_message(self, fmt, *args):
        sys.stdout.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _origin(self):
        return self.headers.get("Origin", "")

    def _cors(self):
        origin = self._origin()
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Cache-Control", "no-store")

    def _send_json(self, code, data):
        body = json_bytes(data)
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/health":
            self._send_json(200, {
                "ok": True,
                "service": "Ruben PostgreSQL Local",
                "port": PORT,
                "driver": "psycopg" if psycopg else "missing",
            })
            return
        self._send_json(404, {"error": "Ruta no encontrada"})

    def _read_json(self):
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8") or "{}")

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/connect":
            self._connect()
            return
        if path == "/api/disconnect":
            self._disconnect()
            return
        self._send_json(404, {"error": "Ruta no encontrada"})

    def _connect(self):
        if psycopg is None:
            self._send_json(500, {"error": "Falta instalar psycopg. Ejecutá RUBEN.bat nuevamente."})
            return

        try:
            d = self._read_json()
            host = str(d.get("host", "")).strip()
            port = int(d.get("port", 5432))
            database = str(d.get("database", "")).strip()
            user = str(d.get("user", "")).strip()
            password = str(d.get("password", ""))

            if not host:
                raise ValueError("Completá servidor/host.")
            if not database:
                raise ValueError("Completá base de datos.")
            if not user:
                raise ValueError("Completá usuario.")
            if not password:
                raise ValueError("Completá contraseña.")

            conn = psycopg.connect(
                host=host,
                port=port,
                dbname=database,
                user=user,
                password=password,
                connect_timeout=7,
                autocommit=True,
            )

            with conn.cursor() as cur:
                cur.execute("select version(), current_database(), current_user")
                version, current_db, current_user = cur.fetchone()

            sid = secrets.token_urlsafe(24)
            with LOCK:
                SESSIONS[sid] = conn

            self._send_json(200, {
                "ok": True,
                "sessionId": sid,
                "serverVersion": version,
                "database": current_db,
                "user": current_user,
            })
        except Exception as e:
            self._send_json(500, {"error": str(e)})

    def _disconnect(self):
        try:
            d = self._read_json()
            sid = str(d.get("sessionId", "")).strip()
            with LOCK:
                conn = SESSIONS.pop(sid, None)
            if conn:
                conn.close()
            self._send_json(200, {"ok": True})
        except Exception as e:
            self._send_json(500, {"error": str(e)})


def main():
    print("=" * 58)
    print("RUBEN · PostgreSQL local")
    print(f"Escuchando en http://{HOST}:{PORT}")
    print("=" * 58)
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        with LOCK:
            for conn in SESSIONS.values():
                try:
                    conn.close()
                except Exception:
                    pass
        server.server_close()


if __name__ == "__main__":
    main()

