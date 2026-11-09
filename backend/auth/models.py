from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'  # Coincide con la tabla en la base de datos

    ID_Usuario = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Nombre = db.Column(db.String(200), nullable=False)
    Email = db.Column(db.String(100), nullable=False, unique=True)
    Password = db.Column(db.Text, nullable=False)  # Coincide con la tabla

    # Propiedades de conveniencia para usar los nombres antiguos
    @property
    def id(self):
        return self.ID_Usuario

    @property
    def name(self):
        return self.Nombre

    @property
    def password(self):
        return self.Password