from app import db, Admin
from werkzeug.security import generate_password_hash

# drops all the existing tables (i.e., both UserData and Admin tables)
# SO BE SURE TO RUN THIS ONLY ONCE (ELSE TAKE A BACKUP OF THE DATA AND THEN RUN THIS SCRIPT TO AVOID LOSING EXISTING DATA )
print("\nExisting tables are dropped\n")
db.drop_all()

# creates new tables
print("\nNew tables are created\n")
db.create_all()


try:
    # below code creates a default admin to access all admin level features
    print("\nCreating the admin credentials\n")
    admin1 = Admin(username = "Luke Strickland", password = generate_password_hash("supersecret123", method = "sha256"))
    db.session.add(admin1)
    db.session.commit()
except:
    print("\nAdmin credentials are already in the database\n")

print("------------ setupdatabase.py file successfully executed ------------")