package jp.tokyo.mytiny;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
 
@Controller
public class SampleController {
 
    @Autowired
    MyDataRepository repository;

    @RequestMapping("/")
    public String index(Model model) {
        //mv.setViewName("index");
        Iterable<MyData> list = repository.findAll();
        model.addAttribute("datas",list);
        return "index";
    }
 
    @RequestMapping(value="/post", method=RequestMethod.POST)
    public String helo(Model model,
            @RequestParam("name") String name,
            @RequestParam("mail") String mail,
            @RequestParam("tel") String tel,
            @RequestParam("age") int age) {
        MyData mydata = new MyData(name,mail,tel,age);
        repository.saveAndFlush(mydata);
        Iterable<MyData> list = repository.findAll();
        model.addAttribute("datas",list);
        return "index";
    }

    @RequestMapping(value="/find", method=RequestMethod.POST)
	public String find(Model model, @RequestParam("find") String fstr) {
        Iterable<MyData> list = repository.findByName(fstr);
        model.addAttribute("datas", list);
        return "index";
    }
    
    
//    @RequestMapping("/schedule/list")
//    @ResponseBody
//    public String schedule(Model model) {
//        return "[]";
//    }    
}