const http = require('http');
const os = require('os');

const VERSION = '3.0';
const INICIO = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

const pagina = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Andina Market</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: #1f2937;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      width: 100%;
      max-width: 480px;
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    }
    .logo {
      width: 72px;
      height: 72px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff9900, #ff6a00);
      color: #fff;
      font-size: 34px;
      line-height: 72px;
    }
    h1 { font-size: 32px; color: #0f2027; }
    .lema { color: #6b7280; margin: 6px 0 24px; }
    .version {
      display: inline-block;
      background: #eef6ff;
      color: #1d4ed8;
      font-size: 22px;
      font-weight: 700;
      padding: 10px 28px;
      border-radius: 999px;
      border: 2px solid #bfdbfe;
    }
    .estado {
      margin-top: 22px;
      color: #15803d;
      font-weight: 600;
    }
    .punto {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #22c55e;
      margin-right: 6px;
    }
    .detalle {
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
      line-height: 1.7;
    }
    .detalle b { color: #374151; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">A</div>
    <h1>Andina Market</h1>
    <p class="lema">Productos de los Andes, directo a tu mesa</p>
    <div class="version">Versi&oacute;n ${VERSION}</div>
    <p class="estado"><span class="punto"></span>Aplicaci&oacute;n en l&iacute;nea</p>
    <div class="detalle">
      Desplegado autom&aacute;ticamente desde GitHub<br>
      <b>Servidor:</b> ${os.hostname()}<br>
      <b>Iniciado:</b> ${INICIO}
    </div>
  </div>
</body>
</html>`;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(pagina);
}).listen(3000);
