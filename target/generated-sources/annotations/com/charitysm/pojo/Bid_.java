package com.charitysm.pojo;

import com.charitysm.pojo.Auction;
import com.charitysm.pojo.BidPK;
import com.charitysm.pojo.User;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value="EclipseLink-2.7.9.v20210604-rNA", date="2022-07-25T17:26:39")
@StaticMetamodel(Bid.class)
public class Bid_ { 

    public static volatile SingularAttribute<Bid, Long> money;
    public static volatile SingularAttribute<Bid, String> message;
    public static volatile SingularAttribute<Bid, User> user;
    public static volatile SingularAttribute<Bid, BidPK> bidPK;
    public static volatile SingularAttribute<Bid, Auction> auction;

}