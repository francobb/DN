import { useEffect, useState } from 'react';
import yelp from '../api/yelp';
//custom hook
export default () => {
  const [restaurants, setRestaurants] = useState([]);
  const [errMessage, setErrMessage] = useState('');

  const searchApi = async (searchTerm: string) => {
    try {
      const response = await yelp.get('/search', {
        params: {
          limit: 50,
          term: searchTerm,
          location: 'stockholm',
        },
      });
      setRestaurants(response.data.businesses);
    } catch (err) {
      setErrMessage('Something went wrong');
    }
  };

  useEffect(() => {
    searchApi('restauranger');
  }, []);

  return [searchApi, restaurants, errMessage];
};