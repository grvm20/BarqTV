package cloudcruiser;

import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import cloudcruiser.domain.Comment;
import cloudcruiser.domain.Series;

public class LambdaFunctionHandler implements RequestHandler<RequestClass, List<ResponseClass>> {
    @Override
    public List<ResponseClass> handleRequest(RequestClass input, Context context) {
    	
        // TODO: implement your handler
    	GraphDB db = new GraphDB(input);
        return db.query(input);
    }
}
