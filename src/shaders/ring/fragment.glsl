varying vec3 vColor;
varying vec2 vUv;

void main()
{
    /*
    *Pattern Simple de particule intense au centre et diffuse sur les bord
    */
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = 1.0 - strength; 
    // strength = pow(strength, 10.0);
    // vec3 color = mix(vec3(0.0), vColor , strength);
    // gl_FragColor = vec4(color, 1.0);

    /*
    Pattern d'étoile un peu plus jolie
    */
    vec2 notUv = gl_PointCoord;
    float strength = 0.15 / (distance(vec2(notUv.x, (notUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
    strength *= 0.15 / (distance(vec2(notUv.y, (notUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
    vec3 color = mix(vec3(0.0), vColor , strength);
    gl_FragColor = vec4(color, 1.0);
}