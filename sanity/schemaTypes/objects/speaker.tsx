import React, { useEffect, useState } from 'react'
import { defineField, defineType, set, unset, useClient, useFormValue, type ObjectInputProps } from 'sanity'
import { Card, Select, Stack, Text } from '@sanity/ui'
import { UserIcon } from '@sanity/icons'

type Participant = { _key: string; name?: string; initials?: string; person?: { _ref?: string } }

/** Speakers listed on the current Text, with names resolved for linked people/artists. */
function useParticipants() {
    const participants = ((useFormValue(['participants']) as Participant[] | undefined) || []).filter((p) => p?._key)
    const client = useClient({ apiVersion: '2024-02-08' })
    const refs = participants.map((p) => p.person?._ref).filter((r): r is string => Boolean(r))
    const refsKey = refs.join(',')
    const [names, setNames] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!refsKey) return
        let cancelled = false
        const ids = refsKey.split(',')
        client
            .fetch<{ _id: string; name?: string }[]>(
                `*[_id in $ids]{ _id, "name": coalesce(name[_key == "en"][0].value, name[0].value, name) }`,
                { ids: [...ids, ...ids.map((id) => `drafts.${id}`)] }
            )
            .then((rows) => {
                if (cancelled) return
                setNames(Object.fromEntries(rows.map((r) => [r._id.replace(/^drafts\./, ''), r.name || ''])))
            })
            .catch(() => {})
        return () => {
            cancelled = true
        }
    }, [client, refsKey])

    const labelFor = (p?: Participant) =>
        (p?.name || (p?.person?._ref && names[p.person._ref]) || 'Unnamed speaker').trim()

    return { participants, labelFor }
}

/** Dropdown of the Text's speakers. Stores the speaker's key, plus their name for the Studio preview. */
function SpeakerInput(props: ObjectInputProps) {
    const { value, onChange, readOnly } = props
    const { participants, labelFor } = useParticipants()
    const current = (value as { participant?: string } | undefined)?.participant || ''

    if (participants.length === 0) {
        return (
            <Card padding={3} tone="caution" border>
                <Text size={1}>Add the people taking part in the Speakers field (Text tab) first.</Text>
            </Card>
        )
    }

    return (
        <Stack space={2}>
            <Select
                value={current}
                disabled={readOnly}
                onChange={(event) => {
                    const key = event.currentTarget.value
                    const participant = participants.find((p) => p._key === key)
                    onChange(
                        key
                            ? [set(key, ['participant']), set(labelFor(participant), ['label'])]
                            : [unset(['participant']), unset(['label'])]
                    )
                }}
            >
                <option value="">Choose a speaker…</option>
                {participants.map((p) => (
                    <option key={p._key} value={p._key}>
                        {labelFor(p)}
                    </option>
                ))}
            </Select>
            {current && !participants.some((p) => p._key === current) && (
                <Text size={1} muted>
                    This speaker was removed from the Speakers list. Choose another.
                </Text>
            )}
        </Stack>
    )
}

/**
 * Inline marker at the start of a turn in an interview or conversation.
 * The site shows the speaker's full name on their first turn, initials after.
 */
export const speaker = defineType({
    name: 'speaker',
    title: 'Speaker',
    type: 'object',
    icon: UserIcon,
    components: { input: SpeakerInput },
    fields: [
        defineField({
            name: 'participant',
            title: 'Speaker',
            type: 'string',
            validation: (Rule) => Rule.required().error('Choose who is speaking.'),
        }),
        // Copy of the name at the time it was chosen; only used for the Studio preview
        defineField({ name: 'label', title: 'Name', type: 'string', hidden: true }),
    ],
    preview: {
        select: { label: 'label' },
        prepare({ label }) {
            return { title: label || 'Choose speaker', media: UserIcon }
        },
    },
})
