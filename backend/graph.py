def gen_pydot_graph(): 
    import pydot 
    import ViT 
 
    factory, model, _, _, _, _ = ViT.get_factory_model() 
    g, rg, layer_weights = ViT.get_graph(factory, model) 
 
    graph = pydot.Dot(graph_type='digraph', rankdir='TB', bgcolor='#f0f0f0', splines='ortho') 
    visited = set() 
 
    node_style = { 
        'shape': 'box', 
        'style': '"filled,rounded"', 
        'fillcolor': 'lightblue', 
        'fontname': 'Roboto Mono', 
        'fontsize': '12',  
    } 
    edge_style = { 
        'color': 'black', 
        'style': 'bold', 
        'fontname': 'Roboto Mono', 
        'fontsize': '10', 
        'constraint': 'true' 
    } 
 
    for node in g: 
        graph.add_node(pydot.Node( 
            node, 
            label=node + "\n\n" + "\n".join(layer_weights[node]), 
            **node_style 
        )) 
 
    def make_graph(node): 
        if node not in rg: 
            return 
        for edge in rg[node]: 
            graph.add_edge(pydot.Edge(node, edge, **edge_style)) 
            if edge not in visited: 
                visited.add(edge) 
                make_graph(edge) 
 
    make_graph(next(iter(g))) 
 
    # Try writing the graph to a PNG file 
    graph.write_png('graphs/graph11.png') 
 
gen_pydot_graph()
