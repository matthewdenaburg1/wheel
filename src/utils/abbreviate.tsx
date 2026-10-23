export interface Person {
  id: number;
  name: string;
  enabled: boolean;
}

/**
 * Computes an abbreviation for a person given the active list of people.
 *
 * Rules:
 * 1. If multi-word (e.g. "John Smith"): returns first initials in uppercase ("JS").
 * 2. If single-word (e.g. "John"):
 *    - Compares against all other single-word names in the active people list.
 *    - Starts with 1 character ("J"). If another single-word name starts with the same prefix,
 *      increases prefix length until unique ("Jo" vs "Ja").
 *    - Case-insensitive comparison; returned abbreviation maintains title case or original casing format.
 */
export const getPersonAbbreviation = (person: Person, allPeople: Person[]): string => {
  const trimmedName = person.name.trim();
  if (!trimmedName) return '';

  const words = trimmedName.split(/\s+/);

  // Rule 1: Multi-word names -> First initials
  if (words.length > 1) {
    return words
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
  }

  // Rule 2: Single-word name -> shortest unique prefix among other single-word names
  const otherSingleWords = allPeople
    .filter((p) => p.id !== person.id && p.enabled)
    .map((p) => p.name.trim())
    .filter((name) => name.split(/\s+/).length === 1 && name.length > 0);

  const lowerTarget = trimmedName.toLowerCase();

  for (let len = 1; len <= trimmedName.length; len++) {
    const prefix = lowerTarget.slice(0, len);
    const hasClash = otherSingleWords.some((other) => other.toLowerCase().startsWith(prefix));

    if (!hasClash || len === trimmedName.length) {
      const resultPrefix = trimmedName.slice(0, len);
      // Capitalize first letter
      return resultPrefix.charAt(0).toUpperCase() + resultPrefix.slice(1);
    }
  }

  return trimmedName;
};
