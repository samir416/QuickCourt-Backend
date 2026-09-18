import java.sql.DriverManager;
public class Test {
    public static void main(String[] args) throws Exception {
        try {
            DriverManager.getConnection("jdbc:mysql://localhost:3306/quickcourt", "root", "");
            System.out.println("SUCCESS WITH quickcourt");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
