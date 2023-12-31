import { Container, Row, Col, Form, Button, Toast } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import appConfig from '../config.js'
import globalState from '../state.js'
/* import './Register.css' */

const Register = () => {
    const navigate = useNavigate()
    const [frm, setFrm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
    })
    const [toastMsg, setToastMsg] = useState({ show: false, msg: '' })
    const [isChecked, setIsChecked] = useState(false)
    const setLoading = globalState((state) => state.setLoading)

    const handleChange = (event) => {
        if (event.target.name === 'termsAndConditions') {
            setIsChecked(event.target.checked)
        } else {
            setFrm({ ...frm, [event.target.name]: event.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isChecked) {
            setToastMsg({ show: true, msg: 'Debes aceptar los términos y condiciones para registrarte.' })
            return
        }

        if (!frm.firstName || !frm.lastName || !frm.email || !frm.password || !frm.phone || !frm.address || !frm.city) {
            setToastMsg({ show: true, msg: 'Por favor, completa todos los campos.' })
            return
        }

        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(frm.email)) {
            setToastMsg({ show: true, msg: 'Por favor, ingresa un correo válido.' })
            return
        }

        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(frm.phone)) {
            setToastMsg({ show: true, msg: 'Por favor, ingresa un teléfono válido.' })
            return
        }

        if (frm.password.length < 8) {
            setToastMsg({ show: true, msg: 'La contraseña debe tener al menos 8 caracteres.' })
            return
        }

        try {
            const userData = {
              firstName: frm.firstName,
              lastName: frm.lastName,
              email: frm.email,
              password: frm.password,
              phone: frm.phone,
              address: frm.address,
              city: frm.city,
            }
          
            const response = await fetch(`${appConfig.API_BASE_URL}${appConfig.POST_USERS_REGISTER}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            })
          
            if (response.status === 201) {
              setToastMsg({ show: true, msg: 'Registro exitoso, por favor inicia sesión.' })
              setLoading(true)
              setTimeout(() => {
                navigate('/login')
                setLoading(false)
              }, 3000)
            } else if (response.status === 400) {
              const data = await response.json()
              setToastMsg({ show: true, msg: data.error || 'El correo electrónico ya está registrado.' })
            } else if (response.status === 500) {
              setToastMsg({ show: true, msg: 'Hubo un error en el servidor. Por favor, inténtalo de nuevo más tarde.' })
            } else {
              setToastMsg({ show: true, msg: 'Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.' })
            }
          } catch (error) {
            setToastMsg({ show: true, msg: 'Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.' })
          }
          
          
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="firstName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={frm.firstName}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="lastName">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={frm.lastName}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="email">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={frm.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={frm.password}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="phone">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={frm.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="address">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={frm.address}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="city">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                value={frm.city}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Text className="text-muted">
                                <a href="#" onClick={() => alert('Aquí van nuestras políticas y privacidad')}>Políticas y Privacidad</a>
                            </Form.Text>
                            <Form.Check
                                type="checkbox"
                                label="Acepto los términos y condiciones"
                                name="termsAndConditions"
                                checked={isChecked}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Registrar
                        </Button>
                    </Form>

                    <Toast
                        show={toastMsg.show}
                        onClose={() => setToastMsg({ show: false, msg: '' })}
                        delay={5000}
                        autohide
                        style={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            minWidth: '250px',
                        }}
                    >
                        <Toast.Header closeButton={false}>
                            {/* Aquí puedes agregar un icono de advertencia si lo deseas */}
                            {/* <img src="icono-de-advertencia.png" className="rounded me-2" alt="Icono de advertencia" /> */}
                            <strong className="me-auto">Atencion!</strong>
                        </Toast.Header>
                        <Toast.Body>{toastMsg.msg}</Toast.Body>
                    </Toast>

                </Col>
            </Row>
        </Container>
    )
}

export default Register
