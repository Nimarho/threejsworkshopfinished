varying vec3 vColor;

void main()
{
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength; 
    strength = pow(strength, 5.0);
    vec3 color = mix(vec3(0.0), vColor , strength);
    if(distance(gl_PointCoord, vec2(0.5)) > 0.5)
    {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
    else
    {
        gl_FragColor = vec4(color, 1.0);
    }
    
}