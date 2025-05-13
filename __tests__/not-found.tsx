import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotFound from '@/app/not-found'

describe('NotFound Page', () => {
    beforeEach(() => {
        render(<NotFound />)
    })

    it('renders the main heading', () => {
        expect(screen.getByRole('heading', { name: /Página no encontrada/i })).toBeInTheDocument()
    })

    it('displays the descriptive text', () => {
        expect(screen.getByText(/Lo sentimos, la página que buscas no existe/i)).toBeInTheDocument()
    })

    it('has a button to go home with the Home icon', () => {
        const homeButton = screen.getByRole('link', { name: /Ir al inicio/i })
        expect(homeButton).toBeInTheDocument()
        expect(homeButton).toHaveAttribute('href', '/')
    })

    it('has a button for the monetary calculator', () => {
        const calcButton = screen.getByRole('link', { name: /Calculadora Monetaria/i })
        expect(calcButton).toBeInTheDocument()
        expect(calcButton).toHaveAttribute('href', '/calculadora')
    })

    it('has a button for historical analysis', () => {
        const analysisButton = screen.getByRole('link', { name: /Análisis histórico/i })
        expect(analysisButton).toBeInTheDocument()
        expect(analysisButton).toHaveAttribute('href', '/analisis-historico')
    })

    it('has a link to contact the developer', () => {
        const contactLink = screen.getByRole('link', { name: /Contacta al desarrollador/i })
        expect(contactLink).toBeInTheDocument()
        expect(contactLink).toHaveAttribute('href', 'https://eduardoprofe666.github.io/')
        expect(contactLink).toHaveAttribute('target', '_blank')
    })
})
