package cloudcruiser;

import java.util.List;

import org.json.JSONObject;

import cloudcruiser.domain.Person;

public class RequestClass {

	private String operation = null;
	private String type = null;
	private String franchise_title = null;
	private String series_title = null;
	private String name = null;
	private String one_friend = null;
	private String all_friends = null;
	private String UUID = null;
	private String episode_title = null;
	private List<Person> friends = null;

	public String getOne_friend() {
		return one_friend;
	}

	public String getEpisode_title() {
		return episode_title;
	}

	public void setEpisode_title(String episode_title) {
		this.episode_title = episode_title;
	}

	public void setOne_friend(String one_friend) {
		this.one_friend = one_friend;
	}

	public String getAll_friends() {
		return all_friends;
	}

	public void setAll_friends(String all_friends) {
		this.all_friends = all_friends;
	}

	public String getUUID() {
		return UUID;
	}

	public void setUUID(String uUID) {
		UUID = uUID;
	}

	public List<Person> getFriends() {
		return friends;
	}

	public void setFriends(List<Person> friends) {
		this.friends = friends;
	}

	public RequestClass() {

	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getFranchise_title() {
		return franchise_title;
	}

	public void setFranchise_title(String franchise_title) {
		this.franchise_title = franchise_title;
	}

	public String getSeries_title() {
		return series_title;
	}

	public void setSeries_title(String series_title) {
		this.series_title = series_title;
	}

	public String getName() {
		return name;
	}

	public void setName(String myname) {
		this.name = myname;
	}
}
