package com.charitysm.pojo;

import com.charitysm.pojo.User;
import java.util.Date;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

<<<<<<< HEAD
@Generated(value="EclipseLink-2.7.9.v20210604-rNA", date="2022-08-15T15:43:46")
=======
@Generated(value="EclipseLink-2.7.9.v20210604-rNA", date="2022-08-15T17:01:07")
>>>>>>> main
@StaticMetamodel(ReportUser.class)
public class ReportUser_ { 

    public static volatile SingularAttribute<ReportUser, User> reportedUser;
    public static volatile SingularAttribute<ReportUser, String> reason;
    public static volatile SingularAttribute<ReportUser, Short> isSolve;
    public static volatile SingularAttribute<ReportUser, Date> reportedDate;
    public static volatile SingularAttribute<ReportUser, Integer> id;
    public static volatile SingularAttribute<ReportUser, String> type;
    public static volatile SingularAttribute<ReportUser, User> userId;

}