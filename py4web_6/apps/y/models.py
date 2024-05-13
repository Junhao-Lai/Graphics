"""
This file defines the database models
"""

from .common import db, Field, auth
from pydal.validators import *
import datetime 

db.define_table(
    "url_map",
    Field("long_url", requires=IS_NOT_EMPTY()),
    auth.signature,
    Field("post_date", "datetime", readable=False, writable=False, default=lambda:datetime.datetime.now()),
    )

if db(db.url_map).count() == 0:
    db.url_map.insert(
        long_url="https://groups.google.com/g/ucsc2024-cse183/",
    )
    db.commit()