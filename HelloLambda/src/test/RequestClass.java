package test;

public class RequestClass {
	String Person;
	String Content;
	String Comment;

	public RequestClass(String Person, String Content,String Comment) {
		this.Person = Person;
		this.Content = Content;
		this.Comment = Comment;
	}

	public RequestClass() {
	}

	public String getPerson() {
		return Person;
	}
}