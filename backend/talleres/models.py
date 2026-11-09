from extensions import db

class CategoriaTaller(db.Model):
    __tablename__ = 'Categorias_Taller'

    ID_Categoria = db.Column(db.Integer, primary_key=True)
    Nombre = db.Column(db.String(100), nullable=False)

    talleres = db.relationship('Taller', backref='categoria', lazy=True)


class Taller(db.Model):
    __tablename__ = 'Taller'

    ID_Taller = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Nombre = db.Column(db.String(100), nullable=False)
    Descripcion = db.Column(db.Text)
    Precio = db.Column(db.Numeric(10, 2), nullable=False)
    Cupo_Disponible = db.Column(db.Boolean, nullable=False)
    Capacidad = db.Column(db.Integer, nullable=False)
    Fecha_Inicio = db.Column(db.DateTime, nullable=False)
    Fecha_Final = db.Column(db.DateTime, nullable=False)

    ID_Categoria = db.Column(db.Integer, db.ForeignKey('Categorias_Taller.ID_Categoria'), nullable=False)
