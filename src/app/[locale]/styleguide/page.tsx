import { getTranslations } from 'next-intl/server'
import { StyleguideClient } from '@/components/styleguide/StyleguideClient'

export async function generateMetadata() {
    return {
        title: 'Styleguide Hub | NCAI',
        description: 'The institution\'s single source of truth for design tokens, components, and institutional guidelines.'
    }
}

export default async function StyleguidePage() {
    // We can fetch initial server-side data here if needed for the styleguide
    return (
        <div className="bg-ivory selection:bg-ochre/20">
            <StyleguideClient />
        </div>
    )
}
