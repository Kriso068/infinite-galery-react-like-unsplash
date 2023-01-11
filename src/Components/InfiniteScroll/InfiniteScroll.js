import React, {useState, useEffect, useRef} from 'react'
import './InfiniteScroll.css'
import {v4 as uuidv4} from 'uuid'

export default function InfiniteScroll() {

    //cela va stocker toutes nos images
    //3 tableaux car nous allons avoir 3 colonnes 
    const [dataImg, setDataImg] = useState([[], [], []])

    //cela va nous servir au scroll infini et la page commencera à 1
    const [pageIndex, setPageIndex] = useState(1)

    //cela va nous servir a faire les recherches
    const [searchState, setSearchState] = useState('random')

    //on défini un firstCall car sinon infiniteFetchData et searchFetchData sont appelé en meme temps
    const [firstCall, setFirstCall] = useState(true)

    const infiniteFetchData = () => {

        //on fetch sur l'API de unsplash avec pageIndex qui est instancié à 1 après on défini le nombre de photos avec per_page ici 30 , le query nous donnera searchData qui est instancié avec random et client ou il faudra utiliser la clé de l'API unsplash
        fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=`)
        .then((response) =>{
            //return la réponse au format json
            return response.json()
        })
        .then((data) => {

            //on créer un tableau
            const imagesReceived = [];

            //pour chaque data recu on va les push dans notre tableau créé juste avant
            data.results.forEach((img) => {

                //urls.regular rendra les photos de taille moyenne 
                imagesReceived.push(img.urls.regular)
            })

            const newFreshState = [
                [...dataImg[0]],
                [...dataImg[1]],
                [...dataImg[2]],
            ]

            //cette index definiera les 30 images par page de 0 à 29
            let index = 0;

            //première boucle c'est pour les trois tableaux
            for (let i = 0; i < 3; i++) {

                //la deuxième boucle c'est pour remplir chaque tableau avec 10 photos
                for (let j = 0; j < 10; j++) {

                    //chaque newFreshState de i recevra les images recu de 0 à 29 
                    newFreshState[i].push(imagesReceived[index])

                    index++;
                }

            }

            //on met à jour notre dataImg
            setDataImg(newFreshState);
            setFirstCall(false)
        })

    }

    //on appel le useEffect de base et à chaque fois que pageIndex change on relance la fonction infinitFetchData pour recupérer de nouvelle images
    useEffect(() => {

        infiniteFetchData()

    }, [pageIndex])



    const searchFetchData = () => {

        //on fetch sur l'API de unsplash avec pageIndex qui est instancié à 1 après on défini le nombre de photos avec per_page ici 30 , le query nous donnera searchData qui est instancié avec random et client ou il faudra utiliser la clé de l'API unsplash
        fetch(`https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=`)
        .then((response) =>{
            //return la réponse au format json
            return response.json()
        })
        .then((data) => {

            //on créer un tableau
            const imagesReceived = [];

            //pour chaque data recu on va les push dans notre tableau créé juste avant
            data.results.forEach((img) => {

                //urls.regular rendra les photos de taille moyenne 
                imagesReceived.push(img.urls.regular)
            })

            const newFreshState = [
                [],
                [],
                [],
            ]

            //cette index definiera les 30 images par page de 0 à 29
            let index = 0;

            //première boucle c'est pour les trois tableaux
            for (let i = 0; i < 3; i++) {

                //la deuxième boucle c'est pour remplir chaque tableau avec 10 photos
                for (let j = 0; j < 10; j++) {

                    //chaque newFreshState de i recevra les images recu de 0 à 29 
                    newFreshState[i].push(imagesReceived[index])

                    index++;
                }

            }

            //on met à jour notre dataImg
            setDataImg(newFreshState);
        })

    }


    //on appel le useEffect de base et à chaque fois que searchState change on relance la fonction searchFetchData pour recupérer de nouvelle images
    useEffect(() => {

        if(firstCall) return;
        searchFetchData()
        
    },[searchState])

    
    const handleSearch = e => {

        e.preventDefault()

        //on recupère la recherche avec la valeur actuel
        setSearchState(inputRef.current.value)

        //on remet index de la page à 1
        setPageIndex(1)
    }

    const inputRef = useRef()

    useEffect(() => {
        //on écoute le scroll et on appel la fonction infiniteCheck
        window.addEventListener('scroll', infiniteCheck);
        

        //cleanup function pour nettoyer 
        return () => {
            window.removeEventListener('scroll', infiniteCheck)
        }
    }, [])


    const infiniteCheck = () => {

        //on isole les constantes
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;


        //si ce que j'ai scrollé + la partie visible de la fenetre est strictement égale à la hauteur de l'écran alors
        if (scrollHeight - scrollTop <= clientHeight) {

            // pageIndex + 1
            setPageIndex(pageIndex => pageIndex + 1)
        }
    }

  return (
    <div className='container'>
        <form
            onSubmit={handleSearch}
        >
            <label htmlFor='search'>
                Votre recherche
            </label>
            <input type='search' id='search' ref={inputRef}/>

        </form>
        <div className='card-list'>
            <div>
                {dataImg[0].map(img => {
                    return <img key={uuidv4()} src={img} alt='image unsplash'/>
                })}
            </div>
            <div>
                {dataImg[1].map(img => {
                    return <img key={uuidv4()} src={img} alt='image unsplash'/>
                })}
            </div>
            <div>
                {dataImg[2].map(img => {
                    return <img key={uuidv4()} src={img} alt='image unsplash'/>
                })}
            </div>
         
        </div>
      
    </div>
  )
}
