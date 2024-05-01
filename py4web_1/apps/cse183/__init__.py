from py4web import action 



@action("index")
@action.uses("index.html")
def index():
    return {"message":"cse183"}


#   return "hello from Eric:)"


@action("welcome")
def welcome(name="everyone"):
    return f"hello {name}!!!"

@action("test")
def test():
    return "This is a test"

@action("error")
def error():
    10/0

