import './style.css'
import type { Actress } from './types/Person'
const URL = import.meta.env.VITE_BASE_URL
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

//task funzione fetch
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

// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:
// GET /actresses
// La funzione deve restituire un array di oggetti Actress.
// Può essere anche un array vuoto.

//task funzione fetch
const getAllActresses = async (): Promise<Actress[]> => {
  //* l'array puo anche esser vuoto come da traccia(caso Error o catch)
  try {
    const response = await fetch(`${URL}/actresses`)
    if (!response.ok) {
      //* controllo response
      throw new Error(`errore HTTP nella risposta: ${response.status}`)
    }
    const dati: unknown = await response.json()
    if (!Array.isArray(dati)) {
      //* controllo che dati sia un Array effettivamente!
      throw new Error(`Attenzione! non è un Array!`)
    }

    //* una volta fatti i dovuti controlli salvo i dati in una variabile 
    //* e nello stesso tempo con il filter mi assicuro che siano tutti "oggetto di type Actress"=>
    const actressesInArray: Actress[] = dati.filter(A => isActress(A))

    //*si poteva passare anche SOLO la funzione effettivamente perchè gia solo lei ritorna true o false(quindi fa da filtro)
    //* e per lo stesso motivo quel true passa a TS ANCHE il type :Actress[](inference) che poteva quindi essere OMESSO
    return actressesInArray
  } catch (error) {
    error instanceof Error
      ? console.error(`attrici non trovate`, error)
      : console.error(`errore sconosciuto`, error)
    return [] //* Array vuoto
  }
}

// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

const getActresses =
  async (ids: number[]) //accetta un parametro ids, che è un array di numeri
    : Promise<(Actress | null)[]> =>
  //la funzione restituisce una Promise che, quando risolta, fornisce un array. 
  // Ogni elemento dell’array può essere un oggetto di tipo Actress oppure(|) null 
  // (ad esempio, se un ID non corrisponde a nessuna attrice).
  {
    try {
      // const promises = ids.map(id => getActress(id)) //? questa variabile è qui SOLO per comodità
      // const actresses = Promise.all(promises) //? idem per questa
      // return actresses
      return Promise.all(ids.map(id => getActress(id)))
    } catch (error) {
      error instanceof Error
        ? console.error(`attrici non trovate`, error)
        : console.error(`errore sconosciuto`, error)
      return [] //* Array vuoto
    }
  }

app.innerHTML = `
    <div>
      <h1> TEST </h1>
    </div>
  `

