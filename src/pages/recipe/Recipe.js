import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { projectFirestore } from '../../firebase/config'

//styles
import './Recipe.css'

export default function Recipe() {
  const { id } = useParams()
  // const url = 'http://localhost:3000/recipes/' + id
  // const { data: recipe, isPending, error } = useFetch(url)
  const { mode } = useTheme()

  const [recipe, setRecipe] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setIsPending(true)

    const unsub = projectFirestore
      .collection('recipes')
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setIsPending(false)
          setRecipe(doc.data())
        } else {
          setIsPending(false)
          setError('Could not find the recipe')
        }
      })
    return () => unsub()
  }, [id])

  return (
    <div className={`recipe ${mode}`}>
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {recipe && (
        <>
          <h2 className="page-title">{recipe.title}</h2>
          <p>Take {recipe.cookingTime} to cook.</p>
          <ul>
            {recipe.ingredients.map((ingre) => (
              <li key={ingre}>{ingre}</li>
            ))}
          </ul>
          <p className="method">{recipe.method}</p>
        </>
      )}
    </div>
  )
}
