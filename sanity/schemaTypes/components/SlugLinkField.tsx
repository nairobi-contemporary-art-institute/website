import React from 'react'
import { FieldProps, SlugValue, useFormValue } from 'sanity'
import { Text, Box, Flex } from '@sanity/ui'

export function SlugLinkField(props: FieldProps) {
    const { value, renderDefault } = props
    const documentType = useFormValue(['_type']) as string
    const slug = (value as SlugValue)?.current

    if (!slug) return <>{renderDefault(props)}</>

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // Determine path based on document type
    let path = `/${slug}`
    if (documentType === 'exhibition') path = `/exhibitions/${slug}`
    if (documentType === 'post') path = `/channel/${slug}`
    if (documentType === 'event') path = `/events/${slug}`
    if (documentType === 'publication') path = `/publications/${slug}`
    if (documentType === 'artist') path = `/artists/${slug}`
    if (documentType === 'collectionItem') path = `/collection/${slug}`

    const fullUrl = `${baseUrl}/en${path}`

    return (
        <Box>
            {renderDefault(props)}
            <Flex marginTop={3} align="center">
                <Text size={1}>
                    <a 
                        href={fullUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                            color: '#a05a2c', 
                            textDecoration: 'none', 
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        View live page ↗
                    </a>
                </Text>
            </Flex>
        </Box>
    )
}
