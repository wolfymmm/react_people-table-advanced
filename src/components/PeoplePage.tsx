import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getPeople } from '../api';
import { Person } from '../types';
import { PeopleTable } from './PeopleTable';
import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const sex = searchParams.get('sex') || '';
  const centuries = searchParams.getAll('centuries');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  useEffect(() => {
    setLoading(true);
    setError(false);

    getPeople()
      .then(setPeople)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const visiblePeople = useMemo(() => {
    return people.filter(p => {
      const normalizedQuery = query.toLowerCase();
      const matchesQuery = !query ||
        p.name.toLowerCase().includes(normalizedQuery) ||
        (p.motherName && p.motherName.toLowerCase().includes(normalizedQuery)) ||
        (p.fatherName && p.fatherName.toLowerCase().includes(normalizedQuery));

      const matchesSex = !sex || p.sex === sex;

      const personCentury = Math.ceil(p.born / 100).toString();
      const matchesCentury = centuries.length === 0 || centuries.includes(personCentury);

      return matchesQuery && matchesSex && matchesCentury;
    });
  }, [people, query, sex, centuries]);

  const sortedPeople = useMemo(() => {
    const result = [...visiblePeople];

    if (sort) {
      result.sort((a, b) => {
        const valA = a[sort as keyof Person] ?? '';
        const valB = b[sort as keyof Person] ?? '';

        if (valA < valB) {
          return order === 'desc' ? 1 : -1;
        }
        if (valA > valB) {
          return order === 'desc' ? -1 : 1;
        }
        return 0;
      });
    }

    return result;
  }, [visiblePeople, sort, order]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="notification is-danger" data-cy="peopleLoadingError">
        Something went wrong while loading people.
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">People Page</h1>

      {people.length > 0 && <PeopleFilters />}

      {people.length > 0 && visiblePeople.length === 0 && (
        <div className="notification is-warning" data-cy="noPeopleMessage">
          There are no people matching the search criteria.
        </div>
      )}

      {people.length === 0 && !loading && (
        <div className="notification is-warning" data-cy="noPeopleMessage">
          No people found in the database.
        </div>
      )}

      {visiblePeople.length > 0 && (
        <PeopleTable
          people={sortedPeople}
          fullPeopleList={people}
          selectedSlug={slug}
        />
      )}
    </div>
  );
};
