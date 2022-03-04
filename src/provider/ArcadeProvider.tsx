import { useEffect, useState } from 'react';
import yelp from '../api/yelp';
//custom hook
export default () => {
  const [arcades, setArcades] = useState([]);
  const [errMessage, setErrMessage] = useState('');

  const searchApi = async (searchTerm: string) => {
    try {
      const response = await yelp.get('/search', {
        params: {
          limit: 50,
          // term: searchTerm,
          term: "Arcades",
          location: 'providence',
        },
      });
      setArcades(response.data.businesses);
    } catch (err) {
      setErrMessage('Something went wrong');
    }
  };

  useEffect(() => {
    searchApi('arcades');
  }, []);

  return [searchApi, arcades, errMessage];
};