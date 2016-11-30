package test;

import org.junit.Rule;
import org.junit.Test;
import org.neo4j.driver.v1.*;
import org.neo4j.graphdb.factory.GraphDatabaseSettings;
import org.neo4j.harness.junit.Neo4jRule;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertThat;
import static org.neo4j.driver.v1.Values.parameters;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.Label;
import org.neo4j.graphdb.Node;
import org.neo4j.graphdb.ResourceIterator;
import org.neo4j.graphdb.Transaction;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.graphdb.schema.IndexDefinition;
import org.neo4j.graphdb.schema.Schema;
import org.neo4j.io.fs.FileUtils;

import static org.neo4j.helpers.collection.Iterators.loop;

public class GraphDataBase {
	@Rule
	public Neo4jRule neo4j = new Neo4jRule().withProcedure(FullTextIndex.class);
	private static final File DB_PATH = new File("target/neo4j-store-with-new-indexing");
	@Test
	public void shouldAllowIndexingAndFindingANode() throws Throwable {
		try (Driver driver = GraphDatabase.driver(neo4j.boltURI(),
				Config.build().withEncryptionLevel(Config.EncryptionLevel.NONE).toConfig())) {

			Session session = driver.session();

			long nodeId = session.run("CREATE (p:User {name:'Brookreson'}) RETURN id(p)").single().get(0).asLong();

			session.run("CALL example.index({id}, ['name'])", parameters("id", nodeId));

			StatementResult result = session.run("CALL example.search('User', 'name:Brook*')");
			assertThat(result.single().get("nodeId").asLong(), equalTo(nodeId));
		}
	}

	public static void main(final String[] args) throws IOException {
		System.out.println("Starting database ...");
		FileUtils.deleteRecursively(DB_PATH);

		GraphDatabaseService graphDb = new GraphDatabaseFactory().newEmbeddedDatabase(DB_PATH);

		{
			// START SNIPPET: createIndex
			IndexDefinition indexDefinition;
			try (Transaction tx = graphDb.beginTx()) {
				Schema schema = graphDb.schema();
				indexDefinition = schema.indexFor(Label.label("User")).on("username").create();
				tx.success();
			}
			// END SNIPPET: createIndex
			// START SNIPPET: wait
			try (Transaction tx = graphDb.beginTx()) {
				Schema schema = graphDb.schema();
				schema.awaitIndexOnline(indexDefinition, 10, TimeUnit.SECONDS);
			}
			// END SNIPPET: wait
			// START SNIPPET: progress
			try (Transaction tx = graphDb.beginTx()) {
				Schema schema = graphDb.schema();
				System.out.println(String.format("Percent complete: %1.0f%%",
						schema.getIndexPopulationProgress(indexDefinition).getCompletedPercentage()));
			}
			// END SNIPPET: progress
		}

		{
			// START SNIPPET: addUsers
			try (Transaction tx = graphDb.beginTx()) {
				Label label = Label.label("User");

				// Create some users
				for (int id = 0; id < 100; id++) {
					Node userNode = graphDb.createNode(label);
					userNode.setProperty("username", "user" + id + "@neo4j.org");
				}
				System.out.println("Users created");
				tx.success();
			}
			// END SNIPPET: addUsers
		}

		{
			// START SNIPPET: findUsers
			Label label = Label.label("User");
			int idToFind = 45;
			String nameToFind = "user" + idToFind + "@neo4j.org";
			try (Transaction tx = graphDb.beginTx()) {
				try (ResourceIterator<Node> users = graphDb.findNodes(label, "username", nameToFind)) {
					ArrayList<Node> userNodes = new ArrayList<>();
					while (users.hasNext()) {
						userNodes.add(users.next());
					}

					for (Node node : userNodes) {
						System.out.println("The username of user " + idToFind + " is " + node.getProperty("username"));
					}
				}
			}
			// END SNIPPET: findUsers
		}

		{
			// START SNIPPET: resourceIterator
			Label label = Label.label("User");
			int idToFind = 45;
			String nameToFind = "user" + idToFind + "@neo4j.org";
			try (Transaction tx = graphDb.beginTx();
					ResourceIterator<Node> users = graphDb.findNodes(label, "username", nameToFind)) {
				Node firstUserNode;
				if (users.hasNext()) {
					firstUserNode = users.next();
				}
				users.close();
			}
			// END SNIPPET: resourceIterator
		}

		{
			// START SNIPPET: updateUsers
			try (Transaction tx = graphDb.beginTx()) {
				Label label = Label.label("User");
				int idToFind = 45;
				String nameToFind = "user" + idToFind + "@neo4j.org";

				for (Node node : loop(graphDb.findNodes(label, "username", nameToFind))) {
					node.setProperty("username", "user" + (idToFind + 1) + "@neo4j.org");
				}
				tx.success();
			}
			// END SNIPPET: updateUsers
		}

		{
			// START SNIPPET: deleteUsers
			try (Transaction tx = graphDb.beginTx()) {
				Label label = Label.label("User");
				int idToFind = 46;
				String nameToFind = "user" + idToFind + "@neo4j.org";

				for (Node node : loop(graphDb.findNodes(label, "username", nameToFind))) {
					node.delete();
				}
				tx.success();
			}
			// END SNIPPET: deleteUsers
		}

		{
			// START SNIPPET: dropIndex
			try (Transaction tx = graphDb.beginTx()) {
				Label label = Label.label("User");
				for (IndexDefinition indexDefinition : graphDb.schema().getIndexes(label)) {
					// There is only one index
					indexDefinition.drop();
				}

				tx.success();
			}
			// END SNIPPET: dropIndex
		}

		System.out.println("Shutting down database ...");
		// START SNIPPET: shutdownDb
		graphDb.shutdown();
		// END SNIPPET: shutdownDb
	}

}