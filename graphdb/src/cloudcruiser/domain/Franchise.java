package cloudcruiser.domain;

import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;

import cloudcruiser.ResponseClass;

@NodeEntity
public class Franchise extends ResponseClass{
	@GraphId
	private Long id;
	private String title;
	private String founded;
	private String contact;
	private String type = "franchise"; 
	
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
	public String getFounded() {
		return founded;
	}
	public void setFounded(String founded) {
		this.founded = founded;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
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
