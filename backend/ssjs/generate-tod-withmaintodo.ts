

for(let i = 0; i<50; i += 1){
  new ds.Todo({
    description: (i+1)+' Todo...',
    done: false
  }).save();
}
  