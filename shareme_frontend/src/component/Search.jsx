import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const Search = ({ search }) => {
    const [pins, setPins] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (search !== '') {
            setLoading(true);
            const query = searchQuery(search);
            client.fetch(query).then((data) => {
                setPins(data);
                setLoading(false);
            });
        } else {
            client.fetch(feedQuery).then((data) => {
                setPins(data);
                setLoading(false);
            });
        }
    }, [search]);

    return (
        <div>

            {loading && <Spinner message="Searching pins" />}
            {pins?.length !== 0 && <MasonryLayout pins={pins} />}
            {pins?.length === 0 && search !== '' && !loading && (
                <div className="mt-10 text-center text-xl ">No Pins Found!</div>
            )}
        </div>
    );
};

export default Search;