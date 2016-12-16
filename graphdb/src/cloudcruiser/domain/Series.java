package cloudcruiser.domain;

import java.util.HashSet;
import java.util.Set;

import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import cloudcruiser.ResponseClass;

@NodeEntity
public class Series extends ResponseClass{
	@GraphId
	private Long id;
	private String title;
	private String date_started;
	private String date_ended;
	private String genre;
	private String type = "series";

	@Relationship(type = "OWNED_BY", direction = Relationship.OUTGOING)
	private Franchise franchise;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDate_started() {
		return date_started;
	}

	public void setDate_started(String date_started) {
		this.date_started = date_started;
	}

	public String getDate_ended() {
		return date_ended;
	}

	public void setDate_ended(String date_ended) {
		this.date_ended = date_ended;
	}

	public String getGenre() {
		return genre;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public Franchise getFranchise() {
		return franchise;
	}

	public void setFranchise(Franchise franchise) {
		this.franchise = franchise;
	}

	public void setType(String type) {
		// TODO Auto-generated method stub
		this.type = type;
	}

	public String getType() {
		// TODO Auto-generated method stub
		return type;
	}
	
}
