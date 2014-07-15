package jp.tokyo.mytiny;

import java.util.ArrayList;
import java.util.List;

public class CommonUtil {

	public static <E> List<E> makeList(Iterable<E> iter) {
	    List<E> list = new ArrayList<E>();
	    for (E item : iter) {
	        list.add(item);
	    }
	    return list;
	}
}
