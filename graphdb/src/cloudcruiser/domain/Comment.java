package cloudcruiser.domain;

import java.util.HashSet;
import java.util.Set;

import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

import cloudcruiser.ResponseClass;

@NodeEntity
public class Comment extends ResponseClass{

	@GraphId
	private Long id;
	private String type = "comment";
	private String content;
	private String time_stamp;

	@Relationship(type = "ON", direction = Relationship.OUTGOING)
	private Series series;
	
	@Relationship(type = "ON", direction = Relationship.OUTGOING)
	private Episode episode;
	
	@Relationship(type = "ON", direction = Relationship.OUTGOING)
	private Franchise franchise;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTime_stamp() {
		return time_stamp;
	}

	public void setTime_stamp(String time_stamp) {
		this.time_stamp = time_stamp;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((content == null) ? 0 : content.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Comment other = (Comment) obj;
		if (content == null) {
			if (other.content != null)
				return false;
		} else if (!content.equals(other.content))
			return false;
		return true;
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
