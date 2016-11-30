package test;

import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class Hello implements RequestHandler<RequestClass, ResponseClass> {

	private static final File DB_PATH = new File("target/neo4j-store-with-new-indexing");

	@Override
	public ResponseClass handleRequest(RequestClass input, Context context) {
		ResponseClass res = new ResponseClass();
		GraphDatabaseService db = new GraphDatabaseFactory().newEmbeddedDatabase(DB_PATH);
		Map<String, Object> n1 = new HashMap<>();
		n1.put(input.Comment, input.Person);

		Map<String, Object> params = new HashMap<>();
		List<Map<String, Object>> maps = Arrays.asList(n1);
		params.put("props", maps);
		String query = "UNWIND {props} AS properties CREATE (n:Person) SET n = properties RETURN n";
		db.execute(query, params);
		
		return res;
	}

}
