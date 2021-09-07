"""
WSGI config for blockex project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/
"""

import os
from django.conf.urls import url
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blockex.settings')
wsgi_app = get_wsgi_application()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from explorer.consumers import ChatConsumer

application = ProtocolTypeRouter({
    "http": wsgi_app,
    # WebSocket chat handler
    "websocket": AuthMiddlewareStack(
        URLRouter([
            url(r'ws/explorer/', ChatConsumer.as_asgi()),
        ])
    ),
})