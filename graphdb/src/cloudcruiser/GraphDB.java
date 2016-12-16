package cloudcruiser;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import org.neo4j.ogm.session.SessionFactory;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import cloudcruiser.domain.Comment;
import cloudcruiser.domain.Episode;
import cloudcruiser.domain.Franchise;
import cloudcruiser.domain.Person;
import cloudcruiser.domain.PersonEpisodeBinding;
import cloudcruiser.domain.Series;

public class GraphDB {

	private SessionFactory sessionFactory = null;
	private org.neo4j.ogm.session.Session session = null;
	private static String CONNECTION_URL = "http://cloudcruisersgraph:FBQDVgW6eUQ8AzV3utae@hobby-pjlglphioeaggbkepcocchol.dbs.graphenedb.com:24789";

	public GraphDB(RequestClass request) {
		sessionFactory = new SessionFactory("cloudcruiser.domain");
		session = sessionFactory.openSession(CONNECTION_URL);
	}

	// execute query
	public List<ResponseClass> query(RequestClass request) {
		if (request == null)
			return null;
		switch (request.getOperation()) {
		case "fetchAll": {
			switch (request.getType()) {
			case "series":
				return getAllSeries(request);
			case "person":
				return getAllPerson();
			case "franchise":
				return getAllFranchise();
			case "episode":
				return getAllEpisode(request);
			}
		}
		case "fetch": {
			switch (request.getType()) {
			case "episode": {
				if (request.getAll_friends() != null && request.getAll_friends().length() > 0)
					return getEpisodeAllFriendsWatched(request);
				if (request.getOne_friend() != null && request.getOne_friend().length() > 0)
					return getEpisodeOneFriendWatched(request);
				return getEpisodeIWatched(request);
			}
			case "friends": {
				return getFriends(request, new LinkedList<>());
			}
			}
		}
		case "create": {
			switch (request.getType()) {
			case "person":
				return createPerson(request);
			case "watched_relationship": {
				if (!watched(request)) {
					return createWatchedRelationsip(request);
				} else
					return getEpisodeIWatched(request);
			}
			case "friend_relationship":
				return createPerson(request);
			}
		}
		}
		return null;
	}

	private List<ResponseClass> getEpisodeIWatched(RequestClass request) {
		// TODO Auto-generated method stub
		Iterable<Episode> queryData = null;
		if (request.getFranchise_title() != null && request.getSeries_title() != null
				&& request.getFranchise_title().length() > 0 && request.getSeries_title().length() > 0) {
			queryData = session.query(Episode.class,
					"MATCH (p:Person)-[:WATCHED]->(e:Episode),(e)-[:BELONGS_TO]->(s:Series),(s)-[:BELONGS_TO]->(f:Franchise) where p.name='"
							+ request.getName() + "' and s.title='" + request.getSeries_title() + "' and f.title='"
							+ request.getFranchise_title() + "' return e;",
					Collections.<String, Object>emptyMap());
		} else if (request.getFranchise_title() != null && request.getFranchise_title().length() > 0) {
			queryData = session.query(Episode.class,
					"MATCH (p:Person)-[:WATCHED]->(e:Episode),(e)-[:BELONGS_TO]->(s:Series),(s)-[:BELONGS_TO]->(f:Franchise) where p.name='"
							+ request.getName() + "' and f.title='" + request.getFranchise_title() + "' return e;",
					Collections.<String, Object>emptyMap());
		} else {
			queryData = session.query(Episode.class,
					"MATCH (p:Person)-[:WATCHED]->(e:Episode) where p.name='" + request.getName() + "' return e;",
					Collections.<String, Object>emptyMap());
		}

		List<ResponseClass> episode = new LinkedList<>();

		for (Episode e : queryData) {
			episode.add(e);
		}
		return episode;
	}

	// Create a person with friends
	// Do nothing if exist
	private List<ResponseClass> createPerson(RequestClass request) {
		List<ResponseClass> response = new LinkedList<>();
		Person me = new Person();
		List<Person> friends = new LinkedList<>();

		if (!getPerson(request.getName(), me))
			me = createOnePerson(request);

		if (request.getFriends() != null) {
			for (Person p : request.getFriends()) {
				//friends.add(p);
				Person temp = new Person();
				if (!getPerson(p.getName(), temp))
					temp = createOnePerson(p);
				friends.add(temp);
				if (!hasRelatiosnship(request.getName(), p.getName()))
					createFriendRelationship(request.getName(), p.getName());
			}
		}

		if (friends != null)
			me.setFriends(friends);

		response.add(me);

		return response;
	}

	// create single person
	private Person createOnePerson(RequestClass request) {
		Person p = new Person();
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
		LocalDate localDate = LocalDate.now();
		p.setName(request.getName());
		p.setMember_since(dtf.format(localDate));
		p.setRole("End User");
		p.setUUID(request.getUUID());
		try {
			session.save(p);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return p;
	}

	// create single person
	private Person createOnePerson(Person p) {
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
		LocalDate localDate = LocalDate.now();
		p.setMember_since(dtf.format(localDate));
		p.setRole("End User");
		try {
			session.save(p);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return p;
	}

	// Create friend relationship
	private void createFriendRelationship(String myName, String friendName) {
		try {
			session.execute("MATCH (you:Person {name:'" + myName + "'}) MATCH (him:Person {name:'" + friendName
					+ "'}) CREATE (you)-[r:FRIENDS]->(him)");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private List<ResponseClass> getEpisodeAllFriendsWatched(RequestClass request) {
		// TODO Auto-generated method stub
		List<Person> friends = new LinkedList<Person>();
		List<ResponseClass> res = new LinkedList<>();
		getFriends(request, friends);
		for (Person p : friends) {
			PersonEpisodeBinding tmp = new PersonEpisodeBinding();
			List<Episode> e = new LinkedList<>();
			getEpisodeOneFriendWatched(request, p.getName(), e);
			if (!e.isEmpty()) {
				tmp.setFriend(p);
				tmp.setEpisode(e);
				res.add(tmp);
			}

		}
		return res;
	}

	private List<ResponseClass> getFriends(RequestClass request, List<Person> friendsList) {
		Iterable<Person> queryResponse = session.query(Person.class,
				"match (p)-[:FRIENDS]-(p1) where p.name='" + request.getName() + "' return p1",
				Collections.<String, Object>emptyMap());
		List<ResponseClass> friends = new LinkedList<>();
		for (Person p : queryResponse) {
			friends.add(p);
			friendsList.add(p);
		}
		return friends;
	}

	// Get the episode that my friend watched
	private List<ResponseClass> getEpisodeOneFriendWatched(RequestClass request) {
		// TODO Auto-generated method stub
		Iterable<Episode> queryData = null;
		if (request.getFranchise_title() != null && request.getSeries_title() != null
				&& request.getFranchise_title().length() > 0 && request.getSeries_title().length() > 0) {
			queryData = session.query(Episode.class,
					"MATCH (p1:Person {name:'" + request.getName() + "'}),(p2:Person {name:'" + request.getOne_friend()
							+ "'}), (p1)-[:FRIENDS]-(p2),(p2)-[:WATCHED]->(e:Episode),(e)-[:BELONGS_TO]->(s:Series),(s)-[:BELONGS_TO]->(f:Franchise) where s.title='"
							+ request.getSeries_title() + "' and f.title='" + request.getFranchise_title()
							+ "' return e;",
					Collections.<String, Object>emptyMap());
		} else if (request.getFranchise_title() != null && request.getFranchise_title().length() > 0) {
			queryData = session.query(Episode.class,
					"MATCH (p1:Person {name:'" + request.getName() + "'}),(p2:Person {name:'" + request.getOne_friend()
							+ "'}), (p1)-[:FRIENDS]-(p2),(p2)-[:WATCHED]->(e:Episode),(e)-[:BELONGS_TO]->(s:Series),(s)-[:BELONGS_TO]->(f:Franchise) where f.title='"
							+ request.getFranchise_title() + "' return e;",
					Collections.<String, Object>emptyMap());
		} else {
			queryData = session.query(Episode.class,
					"MATCH (p1:Person {name:'" + request.getName() + "'}),(p2:Person {name:'" + request.getOne_friend()
							+ "'}), (p1)-[:FRIENDS]-(p2),(p2)-[:WATCHED]->(e:Episode) return e;",
					Collections.<String, Object>emptyMap());
		}
		if (!queryData.iterator().hasNext())
			return null;

		List<Episode> episodes = new LinkedList<>();

		for (Episode e : queryData) {
			episodes.add(e);
		}

		Person friend = new Person();
		getPerson(request.getOne_friend(), friend);

		PersonEpisodeBinding bind = new PersonEpisodeBinding();
		bind.setEpisode(episodes);
		bind.setFriend(friend);
		List<ResponseClass> res = new LinkedList<ResponseClass>();
		res.add(bind);
		return res;
	}

	// Get the episode that my friend watched
	private List<ResponseClass> getEpisodeOneFriendWatched(RequestClass request, String friendname,
			List<Episode> episodes) {
		// TODO Auto-generated method stub
		Iterable<Episode> queryData = null;
		if (request.getFranchise_title() != null && request.getSeries_title() != null
				&& request.getFranchise_title().length() > 0 && request.getSeries_title().length() > 0) {
			queryData = session.query(Episode.class,
					"MATCH (p1:Person {name:'" + request.getName() + "'}),(p2:Person {name:'" + friendname
							+ "'}), (p1)-[:FRIENDS]-(p2),(p2)-[:WATCHED]->(e:Episode),(e)-[:BELONGS_TO]->(s:Series),(s)-[:BELONGS_TO]->(f:Franchise) where s.title='"
							+ request.getSeries_title() + "' and f.title='" + request.getFranchise_title()
							+ "' return e;",
					Collections.<String, Object>emptyMap());
		} else if (request.getFranchise_title() != null && request.getFranchise_title().length() > 0) {
			queryData = session.query(Episode.class,
					"MATCH (p1:Person {name:'" + request.getName() + "'}),(p2:Person {name:'" + friendname
							+ "'}), (p1)-[:FRIENDS]-(p2),(p2)-[:WATCHED]->(e:Episode),(e)-[:BELONGS_TO]->(s:Series),(s)-[:BELONGS_TO]->(f:Franchise) where f.title='"
							+ request.getFranchise_title() + "' return e;",
					Collections.<String, Object>emptyMap());
		} else {
			queryData = session.query(Episode.class,
					"MATCH (p1:Person {name:'" + request.getName() + "'}),(p2:Person {name:'" + friendname
							+ "'}), (p1)-[:FRIENDS]-(p2),(p2)-[:WATCHED]->(e:Episode) return e;",
					Collections.<String, Object>emptyMap());
		}

		List<ResponseClass> episode = new LinkedList<>();

		for (Episode e : queryData) {
			episode.add(e);
			episodes.add(e);
		}
		return episode;
	}

	// get all episodes
	private List<ResponseClass> getAllEpisode(RequestClass request) {
		// TODO Auto-generated method stub
		Iterable<Episode> queryData = null;
		// get all the episodes of one season
		if (request.getSeries_title() != null && request.getSeries_title().length() > 0) {
			queryData = session.query(Episode.class,
					"MATCH (e:Episode),(s:Series),(f:Franchise),(e)-[:BELONGS_TO]->(s),(s)-[:BELONGS_TO]->(f) WHERE s.title='"
							+ request.getSeries_title() + "' and f.title='" + request.getFranchise_title()
							+ "' return e;",
					Collections.<String, Object>emptyMap());
		} else {
			queryData = session
					.query(Episode.class,
							"MATCH (e:Episode),(s:Series),(f:Franchise),(e)-[:BELONGS_TO]->(s),(s)-[:BELONGS_TO]->(f) WHERE f.title='"
									+ request.getFranchise_title() + "' return e;",
							Collections.<String, Object>emptyMap());
		}
		List<ResponseClass> episode = new LinkedList<>();

		for (Episode data : queryData) {
			episode.add(data);
		}
		return episode;
	}

	// Get All Franchise
	public List<ResponseClass> getAllFranchise() {
		// TODO Auto-generated method stub
		Iterable<Franchise> queryData = session.query(Franchise.class, "MATCH (f:Franchise) return f",
				Collections.<String, Object>emptyMap());
		List<ResponseClass> franchise = new LinkedList<>();

		for (Franchise data : queryData) {
			franchise.add(data);
		}
		return franchise;
	}

	// Get All Person
	public List<ResponseClass> getAllPerson() {
		// TODO Auto-generated method stub
		Iterable<Person> queryData = session.query(Person.class, "MATCH (p:Person) return p",
				Collections.<String, Object>emptyMap());
		List<ResponseClass> people = new LinkedList<>();

		for (Person data : queryData) {
			people.add(data);
		}
		return people;
	}

	// Get a single person
	public boolean getPerson(String name, Person p) {
		// TODO Auto-generated method stub
		try {
			Iterable<Person> iter = session.query(Person.class, "MATCH (p:Person {name:'" + name + "'}) return p",
					Collections.<String, Object>emptyMap());
			if (iter.iterator().hasNext()) {
				Person person = iter.iterator().next();
				p.setName(person.getName());
				p.setRole(person.getRole());
				p.setMember_since(person.getMember_since());
				p.setUUID(person.getUUID());
				return true;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	// check if relationship exist between you and me
	public boolean hasRelatiosnship(String me, String you) {
		// TODO Auto-generated method stub
		if (session.query(Person.class,
				"match (p1)-[rel:FRIENDS]->(p2) where p1.name='" + me + "' and p2.name='" + you + "' return p1;",
				Collections.<String, Object>emptyMap()).iterator().hasNext())
			return true;
		return false;
	}

	// Get All Series
	public List<ResponseClass> getAllSeries(RequestClass request) {
		Iterable<Series> queryData = session.query(Series.class,
				"MATCH (s:Series)-[BELONGS_TO]->(f:Franchise) where f.title='" + request.getFranchise_title()
						+ "' return s;",
				Collections.<String, Object>emptyMap());
		List<ResponseClass> series = new LinkedList<>();

		for (Series data : queryData) {
			series.add(data);
		}

		return series;
	}

	public List<ResponseClass> createWatchedRelationsip(RequestClass request) {
		String command = "MATCH (p:Person {name:'" + request.getName() + "'}),(e:Episode {title:'"
				+ request.getEpisode_title() + "'}),(s:Series {title:'" + request.getSeries_title()
				+ "'}),(f:Franchise {title:'" + request.getFranchise_title()
				+ "'}) where (e)-[:BELONGS_TO]->(s) and (s)-[:BELONGS_TO]->(f) create (p)-[:WATCHED]->(e) return p,e;";

		try {
			session.query(command, Collections.<String, Object>emptyMap());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return getEpisodeIWatched(request);
	}

	public boolean watched(RequestClass request) {
		// TODO Auto-generated method stub
		if (session.query(Person.class,
				"match (p:Person)-[rel:WATCHED]->(e:Episode),(e)-[:BELONGS_TO]->(s:Series),(s)-[:BELONGS_TO]->(f:Franchise) where p.name='"
						+ request.getName() + "' and e.title='" + request.getEpisode_title() + "' and s.title='"
						+ request.getSeries_title() + "' and f.title='" + request.getFranchise_title()
						+ "' return p,e,s,f;",
				Collections.<String, Object>emptyMap()).iterator().hasNext())
			return true;
		return false;
	}
}
