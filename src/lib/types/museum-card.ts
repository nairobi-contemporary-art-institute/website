export interface MuseumCardData {
    id: string;            // Unique identifier for the item
    href: string;          // Extracted or built URL (e.g., /whats-on/event-slug)
    label: string;         // Top left pill/category (e.g., "PAGE", "OUTDOOR SCREENING")
    title: string;         // Main title text
    subtitle?: string;     // Subtitle text (optional)
    date?: string;         // Bottom left meta (e.g., "June - September 2025" or "2026")
    image?: any;           // Sanity image object
    backgroundColor?: string; // Fallback background color if no image
    tags: string[];        // Array of string categories/tags used for isotope filtering
    rawStartDate?: string; // ISO date string for calendar filtering
    rawEndDate?: string;   // ISO date string for calendar filtering
}
