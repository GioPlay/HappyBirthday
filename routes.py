from flask import render_template, request, redirect, url_for
from datetime import datetime
import pytz
import os

def init_routes(app):
    tz = pytz.timezone('Asia/Yerevan')

    def get_current_time():
        return datetime.now(pytz.utc).astimezone(tz)

    @app.route('/')
    def index():
        current_date = datetime.now(pytz.utc).astimezone(tz)

        target_date = tz.localize(datetime(2025, 8, 10, 00, 00, 0))

        if current_date < target_date:
            return render_template('waiting.html', target_date=target_date.strftime('%d %B %Y %H:%M:%S'))
        return render_template('index.html')

    @app.route('/wishes')
    def wishes():
        current_date = datetime.now(pytz.utc).astimezone(tz)
        target_date = tz.localize(datetime(2025, 8, 10, 00, 00, 0))

        if current_date < target_date:
            return render_template('waiting.html', target_date=target_date.strftime('%d %B %Y %H:%M:%S'))
        return render_template('wishes.html')