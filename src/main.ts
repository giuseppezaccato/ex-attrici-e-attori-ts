import './style.css'
import type { Actress } from './types/Person'


const app = document.getElementById('app')!

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:
// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.
// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.
const arrayNationalities = ["American", "British", "Australian", "Israeli-American", "South African", "French", "Indian", "Israeli", "Spanish", "South Korean", "Chinese"]

//task funzione di supporto che fa da type guard verifica se isActress è true o false e nel quale wrappare tutte le logiche di controllo
function isActress(dati: unknown): dati is Actress {
  return ( //! ERRORE(comune): Type 'unknown' is not assignable to type 'boolean' questo perchè 
    // dati && //fix ridondante! rimuovendo questa riga l'errore scompare!
    //?  => è tecnicamente inutile scrivere dati && in presenza della riga successiva
    //? semplicemente perchè con `typeof dati === 'object' && dati !== null` stiamo già escludendo gli unici falsy possibili
    typeof dati === 'object' && dati !== null && //
    "id" in dati && typeof dati.id === 'number' &&
    "name" in dati && typeof dati.name === 'string' &&
    "birth_year" in dati && typeof dati.birth_year === 'number' &&
    "death_year" in dati && typeof dati.death_year === 'number' &&
    "biography" in dati && typeof dati.biography === 'string' &&
    "image" in dati && typeof dati.image === 'string' &&
    "most_famous_movies" in dati && //
    Array.isArray(dati.most_famous_movies) && //sia un Array
    dati.most_famous_movies.length === 3 && //sia una Tuple con 3 elementi
    dati.most_famous_movies.every(m => typeof m === "string") && //...e OGNI(every) elemento sia una stringa
    // volendo si potrebbe fare una funzione typeguard SOLO per dati.most_famous_movies
    "awards" in dati && typeof dati.awards === "string" &&
    "nationality" in dati && typeof dati.nationality === "string" &&
    arrayNationalities.includes(dati.nationality) //tra quelle ammesse
  )
}


const URL = import.meta.env.VITE_BASE_URL

const getActress = async (id: number): Promise<Actress | null> => {
  try {
    const response = await fetch(`${URL}/actresses/${id}`)
    const dati: unknown = await response.json()
    if (!isActress(dati)) {
      throw new Error(`dati nel formato sbagliato`)
    }
    return dati
  } catch (error) {
    error instanceof Error
      ? console.error(`attrice non trovata`, error)
      : console.error(`errore sconosciuto`, error)
    return null
  }
}

app.innerHTML = `
    <div>
      <h1> TEST </h1>
    </div>
  `

