from extensions import db

class Reserva(db.Model):
    __tablename__ = 'Reserva'
    ID_Reserva = db.Column(db.Integer, primary_key=True)
    ID_Usuario = db.Column(db.Integer, nullable=False)
    ID_Taller = db.Column(db.Integer, nullable=False)
    ID_Estado = db.Column(db.Integer, nullable=False)
    Fecha_Reserva = db.Column(db.DateTime, nullable=False)
    Estado_Pago = db.Column(db.Integer, nullable=False)
