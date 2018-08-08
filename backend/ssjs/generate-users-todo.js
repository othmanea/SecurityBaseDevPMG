
  for(let i = 0; i<2; i++){
    let u = new ds.User({
     email: `User ${i + 1}`,
      fullName: `user${i+1}`,
      password: `user${i+1}`,
      group: 'users'
    });

    try {
      u.save();
    } catch (e) { }

    u = ds.User.find('fullName === :1', `user${i+1}`);

    if(!u){
      continue;
    }

    for(let j = 0; j<2; j++){
      const t = new ds.Todo({
        description: `Todo ${i+1} ${j+1}`,
        done: false
      });
      t.save();

	new ds.TodoUser({
        userAssigned: u.ID,
        todoAssigned: t.ID,
        comments: "second try"
      }).save();

    } 
  }