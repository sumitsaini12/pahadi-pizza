export const BRAND_NAME = "Pahadi Pizza";
export const TAGLINE = "Authentic Taste from the Hills";
export const ADDRESS = "Pahadi Pizza, Main Chauraha, Kaladhungi, Uttarakhand, India";
export const PHONE_PRIMARY = "+91 87556 13893";
export const PHONE_SECONDARY = "+91 74530 45797";
export const WHATSAPP_NUMBER = "918755613893";
export const INSTAGRAM_HANDLE = "pahadi_pizza_uk04";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;
export const OPENING_HOURS = "Daily: 9:00 AM - 10:00 PM";
export const EMAIL_ADDRESS = "akashsaini875561@gmail.com";

// Feature data without JSX - components will create icons
export const FEATURES = [
  {
    title: "Fresh Ingredients",
    description: "Sourced locally from the hills of Uttarakhand for that unmatched earthy flavor.",
    iconName: "Leaf" as const,
    iconColor: "text-green-600" as const,
  },
  {
    title: "Wood-Style Baking",
    description: "Traditional high-heat baking process that gives our crust a smoky, charred perfection.",
    iconName: "Flame" as const,
    iconColor: "text-red-600" as const,
  },
  {
    title: "Fast Service",
    description: "Your hunger shouldn't wait. We ensure piping hot delivery and quick table service.",
    iconName: "Timer" as const,
    iconColor: "text-orange-600" as const,
  },
  {
    title: "Hygienic Kitchen",
    description: "Our kitchen follows international standards of cleanliness and safety.",
    iconName: "ShieldCheck" as const,
    iconColor: "text-blue-600" as const,
  },
] as const;

