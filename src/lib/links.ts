/**
 * Derived links used by the mobile action surfaces (bottom bar, drawer, location).
 * Built only from the existing business constants; no fact is restated here.
 */
import { ADDRESS } from '../constants';

/** Same Google Maps search the "Get Directions" button has always used. */
export const DIRECTIONS_URL = `https://www.google.com/maps/search/${encodeURIComponent(ADDRESS)}`;

/** Sections the header highlights while scrolling, in page order. */
export const SECTION_IDS = ['top', 'about', 'menu', 'chef', 'gallery', 'reviews', 'location'] as const;
