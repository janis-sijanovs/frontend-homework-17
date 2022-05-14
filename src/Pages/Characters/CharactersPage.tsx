import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader/loader';
import { CharacterType } from '../../Models/CharacterModel';
import styles from './charactersPage.module.scss';

const CharactersPage = () => {
  const [characters, setCharacters] = useState<CharacterType[]>();

  const { search } = useParams();
  const searchFilterArray = search?.split(',');

  const [inputValue, setInputValue] = useState<string>('1');
  const [maxPages, setMaxPages] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const getCharacters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/character?page=
      ${searchFilterArray ? searchFilterArray[0] : ''}&status=${searchFilterArray ? searchFilterArray[1] : ''}`);
      setMaxPages(response.data.info.pages);
      setCharacters(response.data.results);
      setError(undefined);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('No Data');
        } else {
          setError(err.message);
        }
      } else {
        setError('Not Axios Error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCharacters().then();
  }, [search]);

  useEffect(() => {
    if (error) {
      setCharacters(undefined);
    }
  }, [error]);

  return (
    <div>
      <h1 className="heading">
        Charatchers:
      </h1>
      <div className="filter">
        <button
          className="button"
          onClick={() => {
            navigate('/characters/1,');
          }}
        >
          All
        </button>

        <button
          className={`button ${styles.green}`}
          onClick={() => {
            navigate('/characters/1,alive');
          }}
        >
          Alive
        </button>

        <button
          className={`button ${styles.red}`}
          onClick={() => {
            navigate('/characters/1,dead');
          }}
        >
          Dead
        </button>

        <button
          className={`button ${styles.grey}`}
          onClick={() => {
            navigate('/characters/1,unknown');
          }}
        >
          Unknown
        </button>

        <input
          type="number"
          value={inputValue}
          className="input"
          onChange={(e:ChangeEvent<HTMLInputElement>) => {
            // eslint-disable-next-line no-unused-expressions
            (maxPages && +e.target.value > 0 && +e.target.value <= +maxPages)
              ? setInputValue(e.target.value) : e.target.value = inputValue;
          }}
        />
        <button
          className="button"
          onClick={() => {
            navigate(`/characters/${inputValue},${searchFilterArray ? searchFilterArray[1] : ''}`);
          }}
        >
          Go To Page
        </button>
        {maxPages && (
        <p>
          Page
          {' '}
          {searchFilterArray ? searchFilterArray[0] : '0'}
          {' '}
          out of
          {' '}
          {maxPages}
        </p>
        )}
      </div>
      <div className="card-list">
        {characters && characters.map(({
          id, name, image, status,
        }) => (
          <div
            key={id}
            className={`card ${status === 'Alive' ? styles.green : ''} 
          ${status === 'Dead' ? styles.red : ''} ${status === 'unknown' ? styles.grey : ''}`}
          >
            <img src={image} alt="" className="preview__img" />
            <p>
              {id}
              .&nbsp;
              {name}
            </p>

            <button onClick={() => navigate(`/character/${id}`)} className="button">Read More</button>
          </div>
        ))}
      </div>
      {loading ? <Loader /> : null}
      { error && <span>{error}</span>}
    </div>
  );
};

export default CharactersPage;
