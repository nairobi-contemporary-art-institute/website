import '../globals.css'

export const metadata = {
    title: 'NCAI Studio',
    description: 'Sanity Studio for NCAI',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}
