export const APP_NAME = import.meta.env.VITE_APP_NAME || 'PetPals'
export const AGE_OPTIONS = ['Baby', 'Young', 'Adult', 'Senior']
export const SIZE_OPTIONS = ['Small', 'Medium', 'Large']
export const SPECIES = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other']
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PAGE_SIZE = 12;
// helpful for building absolute URLs like http://localhost:5000/uploads/abc.jpg
export const API_ORIGIN = new URL(API_BASE_URL).origin;
