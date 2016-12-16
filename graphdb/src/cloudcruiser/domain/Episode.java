package cloudcruiser.domain;

import java.util.HashSet;
import java.util.Set;

import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import cloudcruiser.ResponseClass;

@NodeEntity
public class Episode extends ResponseClass{
	
	@GraphId
	private Long id;
	private String genre = null;;
	private String title = null;
	private String ID = null;
	private String date_released = null;
	private String type = "Episode";
	private String franchise = null;

	public String getGenre() {
		return genre;
	}

	public void setGenre(String genre) {
		this.genre = genre;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDate_released() {
		return date_released;
	}

	public void setDate_released(String date_released) {
		this.date_released = date_released;
	}

	public void setType(String type) {
		// TODO Auto-generated method stub
		this.type = type;
	}

	public String getType() {
		// TODO Auto-generated method stub
		return type;
	}

	public String getID() {
		return ID;
	}

	public void setID(String iD) {
		ID = iD;
	}
}
