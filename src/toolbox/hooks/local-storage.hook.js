import {
    useEffect,
    useState
} from 'react';
import { readLocalStorage, saveLocalStorage } from '../helpers/local-storage.helper';

function useLocalStorage(
    key,
    initialValue,
) {
    const readValue = () => {
        if (typeof window === 'undefined') {
            return initialValue
        }
        try {
            const item = readLocalStorage(key)
            return item !== null ? item : initialValue
        } catch (error) {
            return initialValue
        }
    }

  // State to store our value
  const [storedValue, setStoredValue] = useState(readValue)

  // ... persists the new value to localStorage.
  const setValue = value => {
        if (typeof window == 'undefined') {
            // console.warn(
            //     `Tried setting localStorage key “${key}” even though environment is not a client`,
            // )
        }

        try {
            const newValue = value instanceof Function ? value(storedValue) : value
            // Save to local storage
            saveLocalStorage(newValue, key)
            // Save state
            setStoredValue(newValue)
            // We dispatch a custom event so every useLocalStorage hook are notified
            window.dispatchEvent(new Event('local-storage'))
        } catch (error) {
            // console.warn(`Error setting localStorage key “${key}”:`, error)
        }
    }

    useEffect(() => {
        setStoredValue(readValue())
    }, [])

    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue())
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('local-storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('local-storage', handleStorageChange)
        }
  }, [])

  return [storedValue, setValue]
}

export { useLocalStorage }