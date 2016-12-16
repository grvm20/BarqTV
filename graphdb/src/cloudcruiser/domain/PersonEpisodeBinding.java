package cloudcruiser.domain;

import java.util.List;

import cloudcruiser.ResponseClass;

public class PersonEpisodeBinding extends ResponseClass{
	private Person friend = null;
	private List<Episode> episode = null;
	public Person getFriend() {
		return friend;
	}
	public void setFriend(Person friend) {
		this.friend = friend;
	}
	public List<Episode> getEpisode() {
		return episode;
	}
	public void setEpisode(List<Episode> episode) {
		this.episode = episode;
	}
	
	
}
