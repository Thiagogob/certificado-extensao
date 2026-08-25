# Servidor de arquivos estáticos para o Railway.
# O site não tem build: são só HTML, CSS, JS e o logo.
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html /srv/index.html
COPY css/       /srv/css/
COPY js/        /srv/js/
COPY assets/    /srv/assets/
