import ViT
import pydot
import keras


def gen_pydot_graph(): 
    
 
    factory, model, _, _, _, _ = ViT.get_factory_model() 
    g, rg, layer_weights = ViT.get_graph(factory, model) 
 
    graph = pydot.Dot(graph_type='digraph', rankdir='TB', bgcolor='#e7ecf3', splines='ortho') 
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

    graph.write_png('graphs/graphvit.png') 
 
#gen_pydot_graph()

def modelArchitecture():
    _, model, _, _, _, _ = ViT.get_factory_model()
    keras.utils.plot_model(model, to_file='graphs/modelbegi22.png', show_shapes=True, show_layer_names=True, rankdir='TB', expand_nested=True)

#modelArchitecture() 